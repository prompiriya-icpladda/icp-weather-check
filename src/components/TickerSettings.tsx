import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, MessageSquare, Edit2, Check, X, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  useAllTickerMessages,
  useCreateTickerMessage,
  useUpdateTickerMessage,
  useDeleteTickerMessage,
  TickerMessage,
} from "@/hooks/useTickerMessages";
import { toast } from "sonner";

const DEFAULT_SPEED = 50;

export const TickerSettings = () => {
  const { data: messages, isLoading } = useAllTickerMessages();
  const createMessage = useCreateTickerMessage();
  const updateMessage = useUpdateTickerMessage();
  const deleteMessage = useDeleteTickerMessage();

  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    const savedSpeed = localStorage.getItem("ticker-speed");
    if (savedSpeed) {
      setSpeed(Number(savedSpeed));
    }
  }, []);

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    localStorage.setItem("ticker-speed", String(newSpeed));
    // Dispatch storage event for same-tab updates
    window.dispatchEvent(new StorageEvent("storage", {
      key: "ticker-speed",
      newValue: String(newSpeed),
    }));
  };

  const handleAdd = async () => {
    if (!newMessage.trim()) {
      toast.error("กรุณาใส่ข้อความ");
      return;
    }

    try {
      await createMessage.mutateAsync({
        message: newMessage.trim(),
        is_active: true,
        order_index: messages?.length || 0,
      });
      setNewMessage("");
      toast.success("เพิ่มข้อความแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (msg: TickerMessage) => {
    setEditingId(msg.id);
    setEditingText(msg.message);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    try {
      await updateMessage.mutateAsync({ id: editingId, message: editingText.trim() });
      setEditingId(null);
      setEditingText("");
      toast.success("บันทึกแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบข้อความนี้หรือไม่?")) {
      try {
        await deleteMessage.mutateAsync(id);
        toast.success("ลบข้อความแล้ว");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  const handleToggleActive = async (msg: TickerMessage) => {
    try {
      await updateMessage.mutateAsync({ id: msg.id, is_active: !msg.is_active });
      toast.success(msg.is_active ? "ซ่อนข้อความแล้ว" : "แสดงข้อความแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleMove = async (msg: TickerMessage, direction: "up" | "down") => {
    if (!messages) return;
    const currentIndex = messages.findIndex((m) => m.id === msg.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= messages.length) return;

    const targetMsg = messages[targetIndex];

    try {
      await Promise.all([
        updateMessage.mutateAsync({ id: msg.id, order_index: targetMsg.order_index }),
        updateMessage.mutateAsync({ id: targetMsg.id, order_index: msg.order_index }),
      ]);
      toast.success("เปลี่ยนลำดับสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">ข้อความวิ่ง (News Ticker)</CardTitle>
        </div>
        <CardDescription>
          ข้อความจะแสดงที่ด้านล่างของหน้าจอและเลื่อนอัตโนมัติ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new message */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="พิมพ์ข้อความใหม่..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={createMessage.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่ม
          </Button>
        </div>

        {/* Messages list */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-center py-4 text-muted-foreground">กำลังโหลด...</p>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  !msg.is_active ? "opacity-50 bg-muted/30" : "bg-card"
                }`}
              >
                {/* Move buttons */}
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleMove(msg, "up")}
                    disabled={messages.findIndex((m) => m.id === msg.id) === 0 || updateMessage.isPending}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleMove(msg, "down")}
                    disabled={
                      messages.findIndex((m) => m.id === msg.id) === messages.length - 1 ||
                      updateMessage.isPending
                    }
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  {editingId === msg.id ? (
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                  ) : (
                    <p className="text-sm truncate">{msg.message}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  {editingId === msg.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(msg)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(msg)}
                        title={msg.is_active ? "ซ่อน" : "แสดง"}
                      >
                        {msg.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground text-sm">
              ยังไม่มีข้อความวิ่ง
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
