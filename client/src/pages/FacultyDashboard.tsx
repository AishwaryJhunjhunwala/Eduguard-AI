import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderUI, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Users, UserCheck, AlertOctagon, TrendingUp, Search, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { PageHeader } from '../components/ui/page-header';
import { getDashboardStats, getStudents } from '../lib/api';

export const FacultyDashboard = () => {
    const [stats, setStats] = useState<any>({});
    const [riskData, setRiskData] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const colorMap: Record<string, string> = {
        "Low Risk": "hsl(var(--success))",
        "Medium Risk": "hsl(var(--warning))",
        "High Risk": "hsl(var(--destructive))"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, studentsRes] = await Promise.all([
                    getDashboardStats(),
                    getStudents()
                ]);

                setStats(statsRes);
                
                // Map risk data to include colors
                const formattedRiskData = (statsRes.riskData || []).map((item: any) => ({
                    ...item,
                    color: colorMap[item.name] || '#ccc'
                }));
                setRiskData(formattedRiskData);

                setAttendanceData(statsRes.attendanceData || []);
                setPerformanceData(statsRes.performanceData || []);
                setStudentsList(studentsRes.data || []);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading dashboard...</span>
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

    const { totalStudents = 0, highRiskStudents = [] } = stats;

    // Calculate averages
    const avgAttendance = attendanceData.length 
        ? Math.round(attendanceData.reduce((a,b) => a + b.percentage, 0) / attendanceData.length)
        : 0;
        
    const avgPerformance = performanceData.length
        ? Math.round(performanceData.reduce((a,b) => a + b.score, 0) / performanceData.length)
        : 0;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
            <PageHeader
                title="Faculty Dashboard"
                description="Monitor class performance and identify at-risk students."
                badge={<Badge variant="secondary" className="px-3 py-1 font-medium bg-secondary text-secondary-foreground border border-border">CS Department</Badge>}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> Total Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all assigned courses</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-success" /> Avg Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{avgAttendance}%</div>
                        <p className="text-xs text-muted-foreground mt-1 float-start">Weekly average</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" /> Class Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{avgPerformance}<span className="text-lg text-muted-foreground font-normal">/100</span></div>
                        <p className="text-xs text-muted-foreground mt-1">Overall average score</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-destructive shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <AlertOctagon className="h-4 w-4 text-destructive" /> At-Risk Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-destructive">{highRiskStudents.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Require immediate intervention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1 shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                        <CardDescription>Current student risk levels</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px] flex items-center justify-center pt-0">
                        {riskData.every((d: any) => d.value === 0) ? (
                            <p className="text-muted-foreground">No risk data available.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {riskData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ fontWeight: 600 }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>Attendance Trend</CardTitle>
                        <CardDescription>Average attendance across days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        {attendanceData.length === 0 ? (
                           <p className="text-muted-foreground flex items-center justify-center h-full">No attendance data available.</p> 
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={attendanceData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} domain={['auto', 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Line type="monotone" dataKey="percentage" name="Attendance" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }} activeDot={{ r: 6, fill: 'hsl(var(--primary))' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3 shadow-sm border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle>Student Risk Monitoring</CardTitle>
                            <CardDescription>Detailed overview of student performance metrics</CardDescription>
                        </div>
                        <div className="relative w-64 hidden sm:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search student name..."
                                className="pl-8 bg-muted/40 border-none shadow-none h-9 rounded-md"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border/50 overflow-hidden">
                            <Table>
                                <TableHeaderUI className="bg-muted/40 h-10">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[250px] font-semibold text-muted-foreground">Student</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Department</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Attendance</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">CGPA</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Risk Level</TableHead>
                                        <TableHead className="text-right font-semibold text-muted-foreground"></TableHead>
                                    </TableRow>
                                </TableHeaderUI>
                                <TableBody>
                                    {studentsList.map((student: any) => (
                                        <TableRow key={student._id} className="group hover:bg-muted/20 transition-colors cursor-pointer">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
                                                        {(student.user?.name || 'US').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{student.user?.name || 'Unknown Student'}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {student.studentId}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium text-sm">{student.department}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${student.attendancePercentage < 75 ? 'text-destructive' : 'text-foreground'}`}>{student.attendancePercentage}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`font-medium ${student.cgpa < 6 ? 'text-destructive' : 'text-foreground'}`}>{student.cgpa}</span>
                                            </TableCell>
                                            <TableCell>
                                                {student.dropoutRisk === 'High' && <Badge variant="destructive" className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-transparent shadow-none">High Risk</Badge>}
                                                {student.dropoutRisk === 'Medium' && <Badge variant="warning" className="bg-warning/20 text-warning-foreground hover:bg-warning/30 border-transparent shadow-none">Medium</Badge>}
                                                {student.dropoutRisk === 'Low' && <Badge variant="success" className="bg-success/15 text-success hover:bg-success/25 border-transparent shadow-none">Low Risk</Badge>}
                                                {student.dropoutRisk === 'Not Assessed' && <Badge variant="secondary" className="shadow-none font-medium">Not Assessed</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground group-hover:bg-background group-hover:shadow-sm">
                                                    <span className="sr-only">Open menu</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {studentsList.length === 0 && (
                                         <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                No students found in the database.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between px-2 pt-4">
                            <p className="text-xs text-muted-foreground">Showing {studentsList.length} students</p>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled className="h-8 shadow-none border-border/50 text-xs">Previous</Button>
                                <Button variant="outline" size="sm" disabled className="h-8 shadow-none border-border/50 text-xs text-foreground bg-background hover:bg-muted font-medium">Next</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
