import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Chat from './Chat';
import Appointments from './Appointments';
import Profile from './Profile';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Tabs defaultValue="chat" className="h-full">
          <div className="border-b">
            <div className="container mx-auto">
              <TabsList className="h-14 bg-transparent">
                <TabsTrigger value="chat" className="text-base h-12">Chat</TabsTrigger>
                <TabsTrigger value="appointments" className="text-base h-12">Find Doctor</TabsTrigger>
                <TabsTrigger value="profile" className="text-base h-12">Profile</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="chat" className="m-0 h-[calc(100vh-120px)]">
            <Chat />
          </TabsContent>

          <TabsContent value="appointments" className="m-0">
            <Appointments />
          </TabsContent>

          <TabsContent value="profile" className="m-0">
            <Profile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
