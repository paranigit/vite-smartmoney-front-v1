import { BreadcrumbItem } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useLocation } from "react-router-dom";

export interface BsBreadcrumbProps {
  items: {
    display: string;
    href?: string;
  }[];
}

export default function BsBreadcrumb() {
  const location = useLocation();
  const { pathname } = location;
  const pathModified = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const segments = pathModified === "" ? [""] : pathModified.split("/");
  console.log(segments);
  let url = "";
  const breadcrumbLinks = segments.map((seg, i) => {
    url += i === 0 ? "/" : i === 1 ? seg : "/" + seg;
    return i === seg.length - 1 ? (
      <BreadcrumbItem key={i} active>
        {seg === "" ? "Home" : seg.charAt(0).toUpperCase() + seg.slice(1)}
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={i} href={url}>
        {seg === "" ? "Home" : seg.charAt(0).toUpperCase() + seg.slice(1)}
      </BreadcrumbItem>
    );
  });

  console.log(url);

  //   console.log(url);

  return (
    <>
      <Breadcrumb>{breadcrumbLinks}</Breadcrumb>
    </>
  );
}
