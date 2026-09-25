export function GET(request: Request) {
  const url = new URL(request.url)
  const name = (url.searchParams.get("name") ?? "VICE").slice(0, 32)
  const symbol = (url.searchParams.get("symbol") ?? "VICE").slice(0, 10)

  return Response.json({
    name,
    symbol,
    description:
      "Hatch sale for a sealed product. The curve raises USDC, then the reserve buys that product into the vault.",
  })
}
