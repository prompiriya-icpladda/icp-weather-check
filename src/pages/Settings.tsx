import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAllSlides, useCreateSlide, useUpdateSlide, useDeleteSlide, Slide } from "@/hooks/useSlides";
import { toast } from "sonner";

const Settings = () => {
  const { data: slides, isLoading } = useAllSlides();
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "announcement" as "weather" | "iframe" | "announcement",
    url: "",
    content: "",
    duration: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slideData = {
      title: formData.title,
      type: formData.type,
      url: formData.type === "iframe" ? formData.url : null,
      content: formData.type === "announcement" ? formData.content : null,
      duration: formData.duration,
      order_index: editingSlide?.order_index ?? (slides?.length || 0),
      is_active: editingSlide?.is_active ?? true,
    };

    try {
      if (editingSlide) {
        await updateSlide.mutateAsync({ id: editingSlide.id, ...slideData });
        toast.success("อัพเดทสไลด์แล้ว");
      } else {
        await createSlide.mutateAsync(slideData);
        toast.success("เพิ่มสไลด์แล้ว");
      }
      resetForm();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      type: slide.type,
      url: slide.url || "",
      content: slide.content || "",
      duration: slide.duration,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบสไลด์นี้หรือไม่?")) {
      try {
        await deleteSlide.mutateAsync(id);
        toast.success("ลบสไลด์แล้ว");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  const handleToggleActive = async (slide: Slide) => {
    try {
      await updateSlide.mutateAsync({ id: slide.id, is_active: !slide.is_active });
      toast.success(slide.is_active ? "ซ่อนสไลด์แล้ว" : "แสดงสไลด์แล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingSlide(null);
    setFormData({
      title: "",
      type: "announcement",
      url: "",
      content: "",
      duration: 60,
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "weather":
        return "สภาพอากาศ";
      case "iframe":
        return "เว็บไซต์ (iframe)";
      case "announcement":
        return "ประกาศ";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">ตั้งค่าสไลด์</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มสไลด์
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSlide ? "แก้ไขสไลด์" : "เพิ่มสไลด์ใหม่"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">ชื่อสไลด์</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="ชื่อสไลด์"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">ประเภท</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "weather" | "iframe" | "announcement") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weather">สภาพอากาศ</SelectItem>
                      <SelectItem value="iframe">เว็บไซต์ (iframe)</SelectItem>
                      <SelectItem value="announcement">ประกาศ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "iframe" && (
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                )}

                {formData.type === "announcement" && (
                  <div className="space-y-2">
                    <Label htmlFor="content">เนื้อหา</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="เนื้อหาประกาศ..."
                      rows={4}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="duration">เวลาแสดง (วินาที)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={5}
                    max={300}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={createSlide.isPending || updateSlide.isPending}>
                    {editingSlide ? "บันทึก" : "เพิ่ม"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              กำลังโหลด...
            </div>
          ) : slides && slides.length > 0 ? (
            slides.map((slide, index) => (
              <Card key={slide.id} className={!slide.is_active ? "opacity-50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div>
                        <CardTitle className="text-lg">{slide.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getTypeLabel(slide.type)} • {slide.duration} วินาที
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(slide)}
                        title={slide.is_active ? "ซ่อน" : "แสดง"}
                      >
                        {slide.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(slide)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(slide.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {slide.type === "iframe" && slide.url && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground truncate">
                      URL: {slide.url}
                    </p>
                  </CardContent>
                )}
                {slide.type === "announcement" && slide.content && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {slide.content}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>ยังไม่มีสไลด์</p>
              <p className="text-sm">คลิก "เพิ่มสไลด์" เพื่อเริ่มต้น</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
