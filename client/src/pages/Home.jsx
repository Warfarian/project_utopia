export default function Home() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Project Utopia</h1>
      <p className="text-lg text-muted-foreground mb-4">
        A community-first platform helping reduce food waste, address homelessness, and assist stray animals.
      </p>
      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Food Waste</h2>
          <p className="text-muted-foreground">Connect food donors with people and NGOs in need.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Homelessness</h2>
          <p className="text-muted-foreground">Help locate and support homeless individuals through community action.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Animal Welfare</h2>
          <p className="text-muted-foreground">Assist stray animals by connecting them with nearby shelters.</p>
        </div>
      </div>
    </div>
  )
}