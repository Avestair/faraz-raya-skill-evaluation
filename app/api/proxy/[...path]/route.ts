import { supabase } from "@/db/client";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_AUTH_KEY = process.env.SUPABASE_AUTH_KEY;

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined in environment variables.");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  try {
    const tableName = (await params).path[0];

    const query = supabase.from(tableName).select("*");

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy GET request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//POST Method
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  try {
    const tableName = (await params).path[0];
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const fullname = searchParams.get("full_name") || "";

    // console.log("Username from URL params:", fullname);

    const query = supabase
      .from(tableName)
      .select("*")
      .ilike("full_name", fullname);

    // console.log(tableName);

    const { data, error } = await query;

    // console.log("data", data);

    if (error) {
      console.error("supabase error", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy POST request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//PUT Method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  try {
    const tableName = (await params).path[0];
    // console.log(tableName);

    const requestBody = await request.json();

    console.log("req body", requestBody);

    const query = supabase
      .from(tableName)
      .update(requestBody)
      .eq("username", requestBody.username)
      .select();

    const { data, error } = await query;
    console.log("data", data);
    console.log("erorr", error);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "No record found or updated" },
        { status: 404 },
      );
    }

    if (error) {
      console.error("supa error: ", error);
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy PUT request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//Delete Method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  try {
    const tableName = (await params).path[0];
    // console.log(tableName);

    const { searchParams } = new URL(request.url);
    const usernameToDelete = searchParams.get("username");

    // console.log(usernameToDelete);

    if (!usernameToDelete) {
      return NextResponse.json(
        { message: "Username is required for deletion" },
        { status: 400 },
      );
    }

    const query = supabase
      .from(tableName)
      .delete()
      .eq("username", usernameToDelete);

    const { data, error } = await query;
    // console.log(data);

    if (error) {
      console.error("supa error: ", error);
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy DELETE request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
