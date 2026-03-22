import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, AlertCircle, Bell, Beaker, Calendar, BookOpen, GraduationCap, Target, Loader2, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { AttendanceChart } from '../components/features/AttendanceChart';
import { SubjectProgressList } from '../components/features/SubjectProgressList';
import { getStudents, getDashboardStats } from '../lib/api';
import { useAuth } from '../store/AuthContext';

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [student, setStudent] = useState<any>(null);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [subjectProgress, setSubjectProgress] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch students and dashboard summary data concurrently
                const [studentsRes, statsRes] = await Promise.all([
                    getStudents(),
                    getDashboardStats()
                ]);

                // Find a student matching authenticated user or fallback
                const students = studentsRes.data || [];
                const targetStudent = user?.email 
                    ? students.find((s: any) => s.user?.email === user.email) 
                    : students[0];
                setStudent(targetStudent || students[0]);

                // Map backend performance data to SubjectProgress format
                const backendPerformance = statsRes?.performanceData || [];
                const subjects = backendPerformance.map((item: any) => ({
                    subject: item.subject,
                    progress: item.score
                }));
                // Fallback subjects if empty
                setSubjectProgress(subjects.length ? subjects : [
                    { subject: 'Computer Science', progress: 95 },
                    { subject: 'Mathematics', progress: 82 },
                    { subject: 'Physics', progress: 78 }
                ]);

                // Map backend attendance to PerformanceData format for the chart
                const backendAttendance = statsRes?.attendanceTrend || [];
                const trend = backendAttendance.map((item: any, i: number) => ({
                    name: `Week ${i + 1}`,
                    score: item.attendance
                }));
                // Fallback trend if empty
                setPerformanceData(trend.length ? trend : [
                    { name: 'Week 1', score: 85 },
                    { name: 'Week 2', score: 82 },
                    { name: 'Week 3', score: 88 },
                    { name: 'Week 4', score: 92 },
                    { name: 'Week 5', score: 89 }
                ]);

            } catch (err) {
                console.error("Failed to load student dashboard:", err);
                setError('Failed to load dashboard data. Please check your backend connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading student dashboard...</span>
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

    const studentName = student?.user?.name || "Student";
    const riskLevel = student?.dropoutRisk || "Low";
    const cgpa = student?.cgpa ? (student.cgpa / 10 * 4).toFixed(1) : "3.8"; // Default mapping if no GPA
    const attendance = student?.attendancePercentage || 96;

    const getVariantByRisk = (risk: string) => {
        switch (risk) {
            case 'High': return 'destructive';
            case 'Medium': return 'warning';
            default: return 'success';
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
            <PageHeader
                title={`Welcome back, ${studentName.split(' ')[0]}`}
                description="Here is your academic overview for the semester."
                badge={
                    <Badge variant={getVariantByRisk(riskLevel)} className="text-sm px-3 py-1 flex items-center gap-1.5">
                        {riskLevel === 'Low' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} 
                        {riskLevel} Risk Status
                    </Badge>
                }
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 p-4 opacity-10 transform rotate-12">
                        <GraduationCap className="h-24 w-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" /> Current GPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{cgpa}<span className="text-lg text-muted-foreground font-normal">/4.0</span></div>
                        <p className="text-xs text-primary mt-2 font-medium bg-primary/10 inline-block px-2 py-1 rounded-md">+0.2 from last term</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Attendance Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{attendance}%</div>
                        <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                            <div className={`h-2 rounded-full ${attendance < 80 ? 'bg-destructive' : attendance < 90 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(100, attendance)}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Classes attended: {Math.round((attendance / 100) * 44)}/44</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{student?.assignments || 10}<span className="text-lg text-muted-foreground font-normal">/10</span></div>
                        <p className="text-sm text-muted-foreground mt-2">Completed</p>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${riskLevel === 'Low' ? 'border-l-success' : riskLevel === 'Medium' ? 'border-l-warning' : 'border-l-destructive'} relative overflow-hidden`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            {riskLevel === 'Low' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className={`h-4 w-4 ${riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'}`} />} Risk Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold mb-1 ${riskLevel === 'Low' ? 'text-success' : riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'}`}>{riskLevel} Risk</div>
                        <p className="text-xs text-muted-foreground leading-snug">
                            {riskLevel === 'Low' ? 'Excellent attendance and consistent performance.' : 'Needs attention to improve academic standing.'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AttendanceChart data={performanceData} />

                <Card className="col-span-1 flex flex-col shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" /> Recent Alerts
                        </CardTitle>
                        <CardDescription>Important updates and messages</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-4">
                            <div className="flex gap-3 bg-muted/40 p-3 rounded-xl border border-border/50 transition-colors hover:bg-muted/60">
                                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm font-semibold text-card-foreground">CS305 Assignment Due</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Tomorrow, 11:59 PM</div>
                                </div>
                            </div>
                            <div className="flex gap-3 bg-muted/40 p-3 rounded-xl border border-border/50 transition-colors hover:bg-muted/60">
                                <Beaker className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm font-semibold text-card-foreground">Physics Lab Rescheduled</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Friday, 2:00 PM - Room 4B</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <SubjectProgressList data={subjectProgress} />
            </div>
        </div>
    );
};
