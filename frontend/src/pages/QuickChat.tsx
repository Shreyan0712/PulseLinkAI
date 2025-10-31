import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Camera, Upload, Mic } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';

const QuickChat = () => {
  const [input, setInput] = useState('');
  const { guestMessages, addGuestMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guestMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    addGuestMessage({
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with faded logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
          <span className="text-6xl font-bold text-primary-foreground">P</span>
        </div>
      </div>

      <div className="flex-1 container mx-auto max-w-4xl px-4 py-6 flex flex-col">
        {/* Info banner */}
        <div className="bg-accent/20 rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            You're chatting as a guest. 
            <Link to="/signup" className="ml-2 text-primary-foreground hover:underline font-medium">
              Sign up
            </Link> for full features
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {guestMessages.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold mb-2">Hello! How can I help you today?</h2>
              <p className="text-muted-foreground">
                Ask me about your health concerns, symptoms, or general medical questions
              </p>
            </div>
          ) : (
            guestMessages.map((message) => (
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="medical-card p-4">
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
                  <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                    <Camera size={18} />
                    Camera
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                    <Upload size={18} />
                    Upload File
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                    <Mic size={18} />
                    Voice
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

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
              disabled={!input.trim()}
              className="shrink-0 btn-primary"
              size="icon"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickChat;
