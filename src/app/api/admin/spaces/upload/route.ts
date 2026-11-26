import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml"
    ];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Type d'image invalide. Formats acceptés : JPG, PNG, WEBP, AVIF" },
        { status: 400 }
      );
    }

    // Max file size: 10MB
    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Fichier trop volumineux (maximum 10 Mo)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(bytes);

    // Sanitize extension and file name
    const originalExt = path.extname(file.name) || ".jpg";
    const rawName = path.basename(file.name, originalExt).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const fileName = `space-${Date.now()}-${rawName.slice(0, 30)}${originalExt}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "spaces");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/spaces/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      message: "Photo téléchargée avec succès"
    });
  } catch (error) {
    console.error("Error uploading space photo:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors du téléchargement de l'image" },
      { status: 500 }
    );
  }
}
