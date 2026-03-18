import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderUI, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Download, Plus, Search, Loader2, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { getStudents } from '../lib/api';

export const StudentsDirectory = () => {
    const navigate = useNavigate();
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
                        <Button variant="outline" size="sm" className="hidden md:flex shadow-sm bg-background border-border/50 text-muted-foreground hover:text-foreground"><Download className="mr-2 h-4 w-4" /> Export</Button>
                        <Button size="sm" className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add Student</Button>
                    </div>
                }
            />

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
