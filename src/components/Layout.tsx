import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import Footer from "./Footer";
import BsAlert from "./bootstrap/BsAlert";
import BsBreadcrumb from "./bootstrap/BsBreadcrumb";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="my-3">
        <Container fluid>
          <BsAlert variant="danger" message=""></BsAlert>
          <BsBreadcrumb></BsBreadcrumb>
          <Outlet />
        </Container>
      </main>
      {/* <Footer /> */}
    </>
  );
}
