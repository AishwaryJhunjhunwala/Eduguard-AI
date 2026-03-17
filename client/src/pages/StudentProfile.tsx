import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Mail, Phone, MapPin, Calendar, Clock, Smile, Loader2, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import { getStudent } from '../lib/api';

export const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!id) return;
            try {
                const response = await getStudent(id);
                setStudent(response.data);
            } catch (err) {
                console.error("Failed to load student profile:", err);
                setError('Failed to load student details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading student profile...</span>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20 text-destructive gap-4">
                <AlertOctagon className="h-12 w-12" />
                <h3 className="text-xl font-bold">Error</h3>
                <p>{error || "Student not found"}</p>
                <Button onClick={() => navigate('/students')} variant="outline">Back to Directory</Button>
            </div>
        );
    }

    const studentName = student.user?.name || "Unknown Student";
    const email = student.user?.email || "Unknown Email";
    const initials = studentName.substring(0, 2).toUpperCase();
    const department = student.department || "Undeclared";
    const semester = student.semester || 1;
    const cgpa = student.cgpa ? (student.cgpa / 10 * 4).toFixed(1) : "N/A";
    const attendance = Math.round(student.attendancePercentage || 0);
    const riskLevel = student.dropoutRisk || "Not Assessed";

    // Mock academic history since backend doesn't provide term-by-term breakdown yet
    const academicHistory = [
        { term: 'Term 1', gpa: 3.2 },
        { term: 'Term 2', gpa: 3.5 },
        { term: 'Current', gpa: parseFloat(cgpa) || 3.0 }
    ];

    const getRiskVariant = (risk: string) => {
        switch (risk) {
            case 'High': return 'destructive';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            <PageHeader
                title="Student Profile"
                description={`ID: ${student.studentId || id}`}
                action={<Button onClick={() => navigate('/students')} variant="outline">Back</Button>}
                badge={
                    <div className="flex gap-2">
                        <Badge variant={student.feePaymentStatus === 'Paid' ? 'success' : 'destructive'} className="px-3 py-1">
                            {student.feePaymentStatus || 'Unknown'} Fee Status
                        </Badge>
                        <Badge variant={getRiskVariant(riskLevel)} className="px-3 py-1">
                            {riskLevel} Risk
                        </Badge>
                    </div>
                }
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar Info */}
                <Card className="md:col-span-1">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <span className="text-4xl text-primary font-bold">{initials}</span>
                        </div>
                        <CardTitle className="text-2xl">{studentName}</CardTitle>
                        <CardDescription className="text-base">{department}, Semester {semester}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>On File</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Campus Base</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Enrolled: {new Date(student.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold mb-2">Academic Advisor</h4>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs">AA</div>
                                <div className="text-sm">
                                    <div className="font-medium">Assigned Advisor</div>
                                    <div className="text-xs text-muted-foreground">advisor@eduguard.ai</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Progress</CardTitle>
                            <CardDescription>Historical GPA (Current GPA: {cgpa})</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={academicHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="term" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 4.0]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" /> Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{attendance}%</div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {attendance < 80 ? "Critical warning levels" : attendance < 90 ? "Below ideal expectations" : "Satisfactory standing"}
                                </p>
                                <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
                                    <div className={`h-full ${attendance < 80 ? 'bg-destructive' : attendance < 90 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(100, attendance)}%` }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Smile className="h-4 w-4 text-muted-foreground" /> Recorded Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${student.mentalHealthStatus === 'Unknown' ? 'text-muted-foreground' : 'text-primary'}`}>{student.mentalHealthStatus || 'Unknown'}</div>
                                <p className="text-sm text-muted-foreground mt-1">Assessed welfare status</p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="outline" className="text-xs">Risk Score: {student.riskScore || 0}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
