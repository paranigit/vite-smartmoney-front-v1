import { BreadcrumbItem } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link, Location, useLocation } from "react-router-dom";

export interface BsBreadcrumbProps {
  items: {
    display: string;
    href?: string;
  }[];
}

export default function BsBreadcrumb() {
  const location = useLocation();
  const { pathname } = location;
  const segments = pathname === "/" ? [""] : pathname.split("/");
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

  //   console.log(url);

  return (
    <>
      <Breadcrumb>{breadcrumbLinks}</Breadcrumb>
    </>
  );
}
