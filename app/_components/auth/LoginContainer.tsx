"use client";

import { Paper, Text } from "@mantine/core";
import LoginForm from "./LoginForm";
import Link from "next/link";

/**
 * LoginContainer component
 * @author Kenneth Sumang
 */
export default function LoginContainer() {
  return (
    <Paper
      withBorder
      w={{
        md: "100%",
        xl: "50%",
      }}
      p="3rem"
    >
      <Text
        style={{
          fontSize: "1.5rem",
          lineHeight: "2rem",
          fontWeight: "700",
          paddingBottom: "2rem",
        }}
        variant="text"
        size="xl"
      >
        Login
      </Text>
      <LoginForm />
      {/* <Text pt="1rem">
        No account yet? <Link href="/auth/register">Sign up</Link>.
      </Text> */}
    </Paper>
  );
}
