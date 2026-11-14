import MessageList from "@/components/admin/MessageList";
import { listMessages } from "@/lib/storage";

export default async function Messages() {
  const messages = await listMessages();
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Пораки и пријави</h1>
      <p className="mt-1 mb-8 text-muted">Пораките од контакт-формата и пријавите за волонтери и членови.</p>
      <MessageList messages={messages} />
    </>
  );
}
