import { Metadata } from "next"
import DesignLabClient from "./page-client"

export const metadata: Metadata = {
  title: "Design Lab",
  description: "Customize and create your apparel designs",
}

export default function DesignLabPage() {
  return <DesignLabClient />
} 