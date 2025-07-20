import Image from "next/image";

interface Props {
  src?: string;
  alt?: string;
  size?: "small" | "normal" | "big";
}

const UserProfile = ({ src, alt, size = "small" }: Props) => {
  const sizeProp = {
    small: "w-11 h-11 rounded-full overflow-hidden",
    normal: "w-11 h-11 rounded-full overflow-hidden",
    big: "w-11 h-11 rounded-full overflow-hidden",
  };

  const sizeImageClass = {
    small: "w-11 h-11 object-cover",
    normal: "w-11 h-11 object-cover",
    big: "w-11 h-11 object-cover",
  };

  const sizeImageProp = {
    small: 45,
    normal: 45,
    big: 45,
  };

  return (
    <div className={sizeProp[size]}>
      {src && alt ? (
        <Image
          src={src}
          alt={alt}
          width={sizeImageProp[size]}
          height={sizeImageProp[size]}
          className={sizeImageClass[size]}
        />
      ) : (
        <div className={`bg-gray-200 ${sizeImageClass[size]}`}></div>
      )}
    </div>
  );
};

export default UserProfile;
