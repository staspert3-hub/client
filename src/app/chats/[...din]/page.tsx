import ChatClient from './ChatClient';

export default async function ChatPage({ 
  params 
}: { 
  params: Promise<{ din: string[] }> 
}) {
  const { din } = await params;
  
  // Парсим параметры: din[0] - room, din[1] - name
  const room = din[0] || 'general';
  const name = din[1] || 'Аноним';

  return <ChatClient room={room} name={name} />;
}