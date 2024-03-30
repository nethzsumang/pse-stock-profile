import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { number, object, string } from "yup";

/**
 * GET request handler
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offsetFrom = (page - 1) * limit;
  const offsetTo = offsetFrom + limit - 1;

  const loggedInUserResponse = await client.auth.getUser();

  if (loggedInUserResponse.error) {
    return Response
      .json({
        error: {
          code: 401,
          message: loggedInUserResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed fetching of records.'
      });
  }

  const recordsResponse = await client.from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", loggedInUserResponse.data.user.id)
    .order("id", { ascending: true })
    .range(offsetFrom, offsetTo);
  
  if (recordsResponse.error) {
    return Response
      .json({
        error: {
          code: 500,
          message: recordsResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed fetching of records.'
      });
  }

  return Response.json(
    { 
      data: recordsResponse.data,
      total: recordsResponse.count,
    },
  );
}

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();
  const validationSchema = object({
    company_id: number().required(),
    type: string().oneOf(["buy", "sell"]).required(),
    price: number().required(),
    quantity: number().required(),
    tax_amount: number().required(),
  });

  try {
    const validated = await validationSchema.validate(body, { strict: true });
  } catch (e) {
    console.log(e);
  }
}