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
    const tableName = (await params).path[0]; // get the table name

    const query = supabase.from(tableName).select("*"); // get all users's query

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
    const searchParams = url.searchParams; //get url params
    const fullname = searchParams.get("full_name") || ""; // get the user's full name from the url params

    // console.log("Username from URL params:", fullname);

    const query = supabase
      .from(tableName)
      .select("*")
      .ilike("full_name", fullname); // query for gettign all the users

    // console.log(tableName);

    const { data, error } = await query; //query data

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
    const tableName = (await params).path[0]; //get the table name
    // console.log(tableName);

    const requestBody = await request.json(); //get the request table

    // console.log("req body", requestBody);

    const query = supabase
      .from(tableName)
      .update(requestBody) //replace teh user data with the new user data
      .eq("username", requestBody.username) // find the exact user data
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
    const tableName = (await params).path[0]; //get the table name
    // console.log(tableName);

    const { searchParams } = new URL(request.url); // get the url params
    const usernameToDelete = searchParams.get("username"); // get the username from the params

    // console.log(usernameToDelete);

    if (!usernameToDelete) {
      return NextResponse.json(
        { message: "Username is required for deletion" },
        { status: 400 },
      );
    }

    const query = supabase
      .from(tableName)
      .delete() // delete that row
      .eq("username", usernameToDelete); // find the exact user row

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
