import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowRight } from "@tabler/icons-react";

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: "gradient" | "muted" | "outline";
}

export function CTASection({
  title,
  description,
  primaryButtonText = "En savoir plus",
  primaryButtonLink = "/",
  secondaryButtonText,
  secondaryButtonLink,
  variant = "gradient",
}: CTASectionProps) {
  const getCardClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-blue-600 to-purple-600 text-white";
      case "muted":
        return "bg-muted";
      case "outline":
        return "border-2";
      default:
        return "bg-gradient-to-br from-blue-600 to-purple-600 text-white";
    }
  };

  const isGradient = variant === "gradient";

  return (
    <Card className={getCardClasses()}>
      <CardContent className="p-8 md:p-12 text-center">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 ${
            !isGradient && "text-foreground"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
            isGradient ? "text-white/90" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className={
              isGradient
                ? "bg-white text-purple-600 hover:bg-white/90"
                : "bg-primary text-primary-foreground"
            }
            asChild
          >
            <Link to={primaryButtonLink}>
              {primaryButtonText}
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {secondaryButtonText && secondaryButtonLink && (
            <Button
              size="lg"
              variant={isGradient ? "outline" : "default"}
              className={
                isGradient
                  ? "border-white text-white hover:bg-white/10"
                  : undefined
              }
              asChild
            >
              <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
