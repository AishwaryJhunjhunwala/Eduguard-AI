import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Users, AlertTriangle, UserCheck, TrendingUp, Loader2, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderUI, TableRow } from '../components/ui/table';
import { PageHeader } from '../components/ui/page-header';
import { getDashboardStats } from '../lib/api';

export const AdminDashboard = () => {

    const [riskData, setRiskData] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [highRiskStudents, setHighRiskStudents] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const color: Record<string, string> = {
        "Low Risk": "#22c55e",
        "Medium Risk": "#f59e0b",
        "High Risk": "#ef4444"
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getDashboardStats();

                setRiskData(res.riskData || []);
                setHighRiskStudents(res.highRiskStudents || []);
                setAttendanceData(res.attendanceData || []);
                setPerformanceData(res.performanceData || []);
                setStats(res || {});
            } catch (err) {
                console.error("Failed to load admin dashboard stats:", err);
                setError('Failed to securely connect to dashboard metrics API.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading administrative dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20 text-destructive gap-4">
                <AlertOctagon className="h-12 w-12" />
                <h3 className="text-xl font-bold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">

            <PageHeader
                title="Admin Dashboard"
                description="Institution-wide overview of student metrics and risk factors."
                badge={<Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Academic Year 2023-2024</Badge>}
            />

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card>
                    <CardHeader className="flex flex-row justify-between pb-2">
                        <CardTitle className="text-sm">Total Students</CardTitle>
                        <Users className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalStudents || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between pb-2">
                        <CardTitle className="text-sm">At-Risk Students</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {highRiskStudents.length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between pb-2">
                        <CardTitle className="text-sm">Average Attendance</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {attendanceData.length ? 
                              Math.round(attendanceData.reduce((a,b)=>a+(b.percentage||b.attendance||0),0)/attendanceData.length) 
                              : 0}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between pb-2">
                        <CardTitle className="text-sm">Performance Avg</CardTitle>
                        <TrendingUp className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {performanceData.length ? 
                              Math.round(performanceData.reduce((a,b)=>a+(b.score||b.average||0),0)/performanceData.length) 
                              : 0}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* CHARTS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Attendance */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData}>
                                <XAxis dataKey={attendanceData[0]?.date ? "date" : "name"} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line dataKey={attendanceData[0]?.attendance ? "attendance" : "percentage"} stroke="#3b82f6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Risk */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={riskData} dataKey="value">
                                    {riskData.map((entry, index) => (
                                        <Cell key={index} fill={color[entry.name] || color[entry.riskLevel] || "#cbd5e1"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>High-Risk Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeaderUI>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Risk</TableHead>
                            </TableRow>
                        </TableHeaderUI>
                        <TableBody>
                            {highRiskStudents.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell className="font-medium">{student.user?.name || student.name || "N/A"}</TableCell>
                                    <TableCell className="text-muted-foreground">{student.studentId || "N/A"}</TableCell>
                                    <TableCell>{student.attendancePercentage || 0}%</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">
                                            {student.dropoutRisk || "High Risk"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {highRiskStudents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                        No high-risk students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
};