import { notFound } from "next/navigation"
import { fetchApartmentDetail } from "@/lib/api"
import { ApartmentDetailClient } from "@/components/apartment/apartment-detail-client"
import type { ApartmentDetail } from "@/lib/types"

interface ApartmentDetailPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

async function getApartmentData(id: string): Promise<ApartmentDetail | null> {
  try {
    const data = await fetchApartmentDetail(id)
    return data
  } catch (error) {
    console.error("Failed to fetch apartment:", error)
    return null
  }
}

export default async function ApartmentDetailPage({ 
  params 
}: ApartmentDetailPageProps) {
  const resolvedParams = await params
  const apartment = await getApartmentData(resolvedParams.id)

  if (!apartment) {
    notFound()
  }

  return <ApartmentDetailClient apartment={apartment} />
}

