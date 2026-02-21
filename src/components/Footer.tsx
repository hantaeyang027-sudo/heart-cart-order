import { MapPin, Phone, Clock, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              <span className="text-primary">도윤이의</span> 피자가게 ♥
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              매일 아침 정성껏 반죽하고,
              <br />
              신선한 재료로 만드는 정직한 피자.
              <br />
              도윤이네 피자를 맛보세요!
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">매장 정보</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                서울시 강남구 피자로 123
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                02-1234-5678
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                매일 11:00 - 22:00
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">소셜 미디어</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 도윤이의 피자가게. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
