export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex h-16 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © 2024 Project Utopia. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary">
            Privacy
          </a>
          <a href="#" className="hover:text-primary">
            Terms
          </a>
          <a href="#" className="hover:text-primary">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}