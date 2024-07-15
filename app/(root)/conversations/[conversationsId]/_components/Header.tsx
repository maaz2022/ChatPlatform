import { Card } from "@/components/ui/card";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string; // Use lowercase string
  name: string;
};

const Header = ({ imageUrl, name }: Props) => {
  return (
    <Card className="w-full flex rounded-lg items-center p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/conversations" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="User Image"
            className="w-8 h-8 rounded-full"
          />
        )}
        <span>{name}</span>
      </div>
    </Card>
  );
};

export default Header;
