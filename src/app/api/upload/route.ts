import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { data: base64, folder } = body;

    if (!base64) {
      return Response.json({ error: "No image data provided" }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(base64, {
      folder: folder ?? "royaltraditionalcraft",
      resource_type: "image",
    });

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err: any) {
    console.error("[upload]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
