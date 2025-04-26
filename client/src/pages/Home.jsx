import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background py-24">
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-6xl font-bold tracking-tight mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Project Utopia
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join our community-driven platform to reduce food waste, support those in need, 
              and help stray animals find shelter. Together, we can make a difference.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/map">Explore Map</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shelters">Find Shelters</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">How We Make a Difference</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border bg-background p-8 hover:border-primary/50 transition-colors">
            <div className="mb-6 text-4xl">🥘</div>
            <h3 className="text-2xl font-semibold mb-3">Food Waste</h3>
            <p className="text-muted-foreground mb-4">
              Connect food donors with people and NGOs in need. Help reduce waste while feeding those who need it most.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link to="/map">Start Donating →</Link>
            </Button>
          </div>

          <div className="group relative overflow-hidden rounded-lg border bg-background p-8 hover:border-primary/50 transition-colors">
            <div className="mb-6 text-4xl">🏠</div>
            <h3 className="text-2xl font-semibold mb-3">Homelessness</h3>
            <p className="text-muted-foreground mb-4">
              Help locate and support homeless individuals through community action. Every person deserves shelter and care.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link to="/shelters">Find Shelters →</Link>
            </Button>
          </div>

          <div className="group relative overflow-hidden rounded-lg border bg-background p-8 hover:border-primary/50 transition-colors">
            <div className="mb-6 text-4xl">🐾</div>
            <h3 className="text-2xl font-semibold mb-3">Animal Welfare</h3>
            <p className="text-muted-foreground mb-4">
              Assist stray animals by connecting them with nearby shelters. Help our furry friends find loving homes.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link to="/map">Report Animals →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container py-24">
        <div className="rounded-lg border bg-background/50 backdrop-blur-sm p-12 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our growing community of volunteers and donors. Together, we can create positive change in our neighborhoods.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/profile">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}