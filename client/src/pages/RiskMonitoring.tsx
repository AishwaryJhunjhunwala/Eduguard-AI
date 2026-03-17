import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderUI, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Filter, Search, PlusCircle, Loader2, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from 'recharts';
import { PageHeader } from '../components/ui/page-header';
import { predictStudentDropout, getStudents } from '../lib/api';
import type { StudentData } from '../lib/api';

export const RiskMonitoring = () => {
    const [riskScatterData, setRiskScatterData] = useState<any[]>([]);
    const [studentRiskList, setStudentRiskList] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: '',
        major: '',
        absences: 0,
        currentGPA: 7.5
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudents();
                const students = response.data || [];

                // Map to Scatter Data
                const scatter = students.map((s: any) => ({
                    attendance: s.attendancePercentage,
                    gpa: (s.cgpa / 10) * 4, // Approx mapped to 4.0 scale if cgpa is out of 10
                    amount: s.riskScore || 50,
                    name: s.user?.name || "Unknown"
                }));
                setRiskScatterData(scatter);

                // Map to Risk List
                const riskList = students.map((s: any) => {
                    const factors = [];
                    if (s.attendancePercentage < 80) factors.push('Low Attendance');
                    if (s.cgpa < 6.0) factors.push('Low GPA');
                    if (s.feePaymentStatus !== 'Paid') factors.push('Fee Pending');
                    if (factors.length === 0) factors.push('None');

                    return {
                        id: s._id,
                        name: s.user?.name || "Unknown",
                        major: s.department || "Undeclared",
                        riskLevel: s.dropoutRisk || "Not Assessed",
                        factors
                    };
                });
                setStudentRiskList(riskList);
            } catch (err) {
                console.error("Failed to load students:", err);
                setError('Failed to load risk data');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Construct full student data object with defaults for uncollected form fields
            const data: StudentData = {
                School: 'GP',
                Gender: 'F',
                Age: 18,
                Address: 'U',
                Family_Size: 'GT3',
                Parental_Status: 'T',
                Mother_Education: 3,
                Father_Education: 3,
                Mother_Job: 'services',
                Father_Job: 'services',
                Reason_for_Choosing_School: 'course',
                Guardian: 'mother',
                Travel_Time: 1,
                Study_Time: 2,
                Number_of_Failures: formData.currentGPA < 5.0 ? 1 : 0,
                School_Support: 'yes',
                Family_Support: 'yes',
                Extra_Paid_Class: 'no',
                Extra_Curricular_Activities: 'yes',
                Attended_Nursery: 'yes',
                Wants_Higher_Education: 'yes',
                Internet_Access: 'yes',
                In_Relationship: 'no',
                Family_Relationship: 4,
                Free_Time: 3,
                Going_Out: 3,
                Weekend_Alcohol_Consumption: 1,
                Weekday_Alcohol_Consumption: 1,
                Health_Status: 5,
                Number_of_Absences: formData.absences,
                Grade_1: Math.round((formData.currentGPA / 10) * 20), // Map 0-10 GPA to 0-20 grade scale
                Grade_2: Math.round((formData.currentGPA / 10) * 20)
            };

            const prediction = await predictStudentDropout(data);
            
            // Map prediction to UI risk levels
            let riskLevel = 'Low';
            const factors: string[] = [];
            
            if (prediction.risk_score > 0.7 || prediction.dropout) {
                riskLevel = 'High';
                if (formData.absences > 5) factors.push('High Absences');
                if (formData.currentGPA < 6.0) factors.push('Low GPA');
                if (factors.length === 0) factors.push('Model Flagged');
            } else if (prediction.risk_score > 0.4) {
                riskLevel = 'Medium';
                if (formData.absences > 3) factors.push('Moderate Absences');
                if (formData.currentGPA < 7.0) factors.push('Below Average GPA');
            } else {
                factors.push('None');
            }

            const newStudent = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || 'New Student',
                major: formData.major || 'Undeclared',
                riskLevel,
                factors
            };

            const newScatter = {
                attendance: Math.max(0, 100 - (formData.absences * 2)),
                gpa: formData.currentGPA / 10 * 4,  // convert back to 0-4 for chart axis
                amount: prediction.risk_score * 300,
                name: newStudent.name
            };

            setStudentRiskList([newStudent, ...studentRiskList]);
            setRiskScatterData([...riskScatterData, newScatter]);
            
            setIsAdding(false);
            setFormData({ name: '', major: '', absences: 0, currentGPA: 7.5 });
        } catch (error) {
            console.error("Failed to predict dropout:", error);
            alert("Error running prediction. Ensure the backend ML server is running.");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = studentRiskList.filter(s => 
        (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.major || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading risk data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full py-20 text-destructive">
                <AlertOctagon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Live Risk Dashboard"
                action={
                    <div className="flex gap-2">
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter By</Button>
                        <Button onClick={() => setIsAdding(!isAdding)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> 
                            New Entry
                        </Button>
                    </div>
                }
            />

            {isAdding && (
                <Card className="border-l-4 border-l-primary bg-muted/30">
                    <CardHeader>
                        <CardTitle>Add Student Entry</CardTitle>
                        <CardDescription>Simulate student dropout risk prediction live using the ML model.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddStudent} className="flex gap-4 items-end flex-wrap">
                            <div className="grid gap-2 w-full max-w-xs">
                                <label className="text-sm font-medium">Student Name</label>
                                <Input 
                                    required 
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2 w-full max-w-xs">
                                <label className="text-sm font-medium">Major</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Computer Science" 
                                    value={formData.major}
                                    onChange={(e) => setFormData({...formData, major: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2 w-24">
                                <label className="text-sm font-medium">Absences</label>
                                <Input 
                                    type="number" 
                                    required 
                                    min="0"
                                    value={formData.absences}
                                    onChange={(e) => setFormData({...formData, absences: parseInt(e.target.value) || 0})} 
                                />
                            </div>
                            <div className="grid gap-2 w-24">
                                <label className="text-sm font-medium">GPA (0-10)</label>
                                <Input 
                                    type="number" 
                                    required 
                                    min="0" max="10" step="0.1"
                                    value={formData.currentGPA}
                                    onChange={(e) => setFormData({...formData, currentGPA: parseFloat(e.target.value) || 0})} 
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="min-w-[140px]">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Run Prediction"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="mb-2">
                <CardHeader>
                    <CardTitle>Continuous Attendance vs GPA Correlation</CardTitle>
                    <CardDescription>Predictive visualization of student risk factors. Larger circles indicate higher model-predicted risk scores.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {riskScatterData.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No scatter data available</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis type="number" dataKey="attendance" name="Attendance %" unit="%" domain={[40, 100]} />
                                <YAxis type="number" dataKey="gpa" name="GPA" unit="" domain={[0.0, 4.0]} />
                                <ZAxis type="number" dataKey="amount" range={[60, 400]} name="Risk Weight" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Students" data={riskScatterData} fill="hsl(var(--destructive))" opacity={0.7} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Live Intervention Roster</CardTitle>
                        <CardDescription>Comprehensive list of students and detailed risk profiles updated from the backend</CardDescription>
                    </div>
                    <div className="relative w-64 hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search roster..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeaderUI>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Major</TableHead>
                                <TableHead>Risk Factors</TableHead>
                                <TableHead className="text-right">Risk Level</TableHead>
                            </TableRow>
                        </TableHeaderUI>
                        <TableBody>
                            {filteredStudents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No students found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.major}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {student.factors.map((factor: string, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">{factor}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={student.riskLevel === 'High' ? 'destructive' : student.riskLevel === 'Medium' ? 'warning' : student.riskLevel === 'Low' ? 'success' : 'secondary'}>
                                            {student.riskLevel}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
