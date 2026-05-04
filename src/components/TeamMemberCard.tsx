import Image from "next/image";
import Button from "./Button";

interface TeamMemberCardProps {
  name: string;
  role: string;
  imageSrc: string;
  imagePosition?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function TeamMemberCard({ name, role, imageSrc, imagePosition, buttonLabel, buttonHref }: TeamMemberCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-48 h-48 rounded-full overflow-hidden mb-4 bg-wsm-darker">
        <Image
          src={imageSrc}
          alt={name}
          width={192}
          height={192}
          className="object-cover w-full h-full"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      </div>
      <h4 className="font-heading text-lg font-black uppercase">{name}</h4>
      <p className="text-sm text-wsm-gray mt-1">{role}</p>
      {buttonLabel && buttonHref && (
        <div className="mt-3">
          <Button href={buttonHref}>{buttonLabel}</Button>
        </div>
      )}
    </div>
  );
}
