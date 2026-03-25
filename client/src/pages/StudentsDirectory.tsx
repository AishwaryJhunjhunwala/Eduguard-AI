import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderUI, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Download, Plus, Search, Loader2, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { getStudents, addStudent } from '../lib/api';

type StudentFormState = {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    department: string;
    attendance: number;
    cgpa: number;
};

export const StudentsDirectory = () => {
    const navigate = useNavigate();
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<StudentFormState>({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        department: '',
        attendance: 100,
        cgpa: 8.0
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudents();
                setStudentsList(response.data || []);
            } catch (err) {
                console.error("Failed to load students directory:", err);
                setError('Failed to load students directory. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addStudent(formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', rollNumber: '', department: '', attendance: 100, cgpa: 8.0 });
            
            // Refresh directory
            setLoading(true);
            const response = await getStudents();
            setStudentsList(response.data || []);
        } catch (error) {
            console.error(error);
            alert("Error adding student. Make sure email is not already in use.");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleExport = () => {
        if (studentsList.length === 0) {
            alert('No students to export');
            return;
        }

        // Create CSV content
        const headers = ['Name', 'Email', 'Roll Number', 'Department', 'Attendance %', 'GPA', 'Risk Level'];
        const csvContent = [
            headers.join(','),
            ...studentsList.map(student => [
                `"${student.user?.name || ''}"`,
                `"${student.user?.email || ''}"`,
                `"${student.studentId || ''}"`,
                `"${student.department || ''}"`,
                student.attendancePercentage || 0,
                student.cgpa ? (student.cgpa / 10 * 4).toFixed(2) : 0,
                `"${student.dropoutRisk || 'Unknown'}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'students_directory.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredStudents = studentsList.filter(s => 
        (s.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.studentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading directory...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20 text-destructive">
                <AlertOctagon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
            <PageHeader
                title="Students Directory"
                description="Manage and view all student administrative records."
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden md:flex shadow-sm bg-background border-border/50 text-muted-foreground hover:text-foreground" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
                        <Button size="sm" className="shadow-sm" onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Student</Button>
                    </div>
                }
            />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md bg-background relative z-50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Add New Student</CardTitle>
                            <CardDescription>Creates user account with login credentials and automatically calculates initial risk profile via AI.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                                <Input required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                <Input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                <Input type="password" placeholder="Password (leave empty for default 'student123')" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                <Input required placeholder="Roll Number (e.g. CS24B001)" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
                                <Input required placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="text-xs text-muted-foreground mb-1 block">Attendance %</label>
                                        <Input required type="number" min="0" max="100" value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value) || 0})} />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-xs text-muted-foreground mb-1 block">GPA (0-10)</label>
                                        <Input required type="number" min="0" max="10" step="0.1" value={formData.cgpa} onChange={(e) => setFormData({...formData, cgpa: parseFloat(e.target.value) || 0})} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</Button>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save & Analyze"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="shadow-sm border-border/50 overflow-hidden">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/10 pb-4 border-b border-border/30">
                    <div>
                        <CardTitle>All Students</CardTitle>
                        <CardDescription>A complete list of students enrolled.</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search by name, ID, or email..." 
                            className="pl-9 h-9 bg-background shadow-sm border-border/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeaderUI className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-muted-foreground pl-6">Student ID</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold text-muted-foreground">Email</TableHead>
                                <TableHead className="hidden lg:table-cell font-semibold text-muted-foreground">Department</TableHead>
                                <TableHead className="hidden sm:table-cell font-semibold text-muted-foreground">Semester</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground pr-6">Fee Status</TableHead>
                            </TableRow>
                        </TableHeaderUI>
                        <TableBody>
                            {filteredStudents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No students found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredStudents.map((student: any) => (
                                <TableRow
                                    key={student._id}
                                    className="cursor-pointer hover:bg-muted/30 transition-colors group"
                                    onClick={() => navigate(`/students/${student._id}`)}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground pl-6">{student.studentId || "N/A"}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {(student.user?.name || "US").substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="group-hover:text-primary transition-colors">{student.user?.name || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{student.user?.email || "N/A"}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-sm">{student.department || "N/A"}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">Sem {student.semester || 1}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Badge variant={student.feePaymentStatus === 'Paid' ? 'success' : student.feePaymentStatus === 'Overdue' ? 'destructive' : 'secondary'} className="shadow-none font-medium">
                                            {student.feePaymentStatus}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border/30 bg-muted/10">
                        <p className="text-xs text-muted-foreground">Showing {filteredStudents.length} of {studentsList.length} students</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-8 shadow-none border-border/50 text-xs bg-background">Previous</Button>
                            <Button variant="outline" size="sm" disabled className="h-8 shadow-none border-border/50 text-xs text-foreground bg-background hover:bg-muted font-medium">Next</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
