import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="my-3">
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
