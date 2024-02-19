import { NextResponse } from "next/server";
import sha1 from "sha1";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const img = formData.get("file");
    if (!img) {
      return NextResponse.json({ success: false, message: "no image found" });
    }

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImageData = await uploadResponse.json();
    return NextResponse.json({
      uploadedImageData,
      message: "Success",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ success: false, message: "no url found" });
    }
    const regex = /\/upload\/v\d+\/(uploadimages\/[^.]+)\.\w{3,4}$/;
    const publicId = url.match(regex);
    const timestamp = new Date().getTime();
    const string = `public_id=${publicId[1]}&timestamp=${timestamp}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`;
    const signature = sha1(string);

    const formData = new FormData();
    formData.append("public_id", publicId[1]);
    formData.append("signature", signature);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );
    await res.json();
    return NextResponse.json({
      message: "Success",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", status: 500 });
  }
}
