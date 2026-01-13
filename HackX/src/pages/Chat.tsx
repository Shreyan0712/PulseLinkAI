import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, Camera, Upload, Mic, MessageSquare, History } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const Chat = () => {
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const { threads, currentThread, setCurrentThread, addMessage, createNewThread } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!currentThread) {
      toast.error('Please start a conversation first');
      return;
    }

    addMessage({
      role: 'user',
      content: input,
    });

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    toast.success(`File "${file.name}" uploaded (UI only)`);
    
    if (currentThread) {
      addMessage({
        role: 'user',
        content: `[File uploaded: ${file.name}]`,
        fileAttachment: {
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
        },
      });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-64 border-r bg-card p-4">
          <Button
            onClick={createNewThread}
            className="w-full mb-4 btn-primary"
          >
            <MessageSquare className="mr-2" size={18} />
            New Chat
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <History size={16} />
              History
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setCurrentThread(thread)}
                  className={`w-full text-left p-3 rounded-lg mb-2 text-sm hover:bg-accent transition-colors ${
                    currentThread?.id === thread.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="font-medium truncate">{thread.title}</div>
                  <div className="text-xs text-muted-foreground">{thread.date}</div>
                </button>
              ))}
            </ScrollArea>
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-4xl px-4 py-6 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            {!currentThread ? (
              <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold mb-2">Start a New Conversation</h2>
                <p className="text-muted-foreground mb-6">
                  Click "New Chat" to begin talking with your AI health assistant
                </p>
                <Button onClick={createNewThread} className="btn-primary">
                  <MessageSquare className="mr-2" size={18} />
                  Start Chat
                </Button>
              </div>
            ) : currentThread.messages.length === 0 ? (
              <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground">
                  Ask me about your health concerns, symptoms, or general medical questions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card shadow-soft'
                      }`}
                    >
                      {message.fileAttachment && (
                        <div className="mb-2 p-2 bg-background/10 rounded">
                          <p className="text-xs font-medium">{message.fileAttachment.name}</p>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="medical-card p-4 mt-4">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <Plus size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-48 p-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      size="sm"
                      onClick={() => toast.info('Camera feature (UI only)')}
                    >
                      <Camera size={18} />
                      Camera
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={18} />
                      Upload File
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      size="sm"
                      onClick={() => toast.info('Voice feature (UI only)')}
                    >
                      <Mic size={18} />
                      Voice
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />

              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Shift + Enter for new line)"
                className="min-h-[50px] max-h-[200px] resize-none"
                rows={1}
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || !currentThread}
                className="shrink-0 btn-primary"
                size="icon"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
