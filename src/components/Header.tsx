import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="primary"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand href="/">Smart Money</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" activeKey={location.pathname}>
            <Nav.Link href="/" className="px-2">
              Home
            </Nav.Link>
            <NavDropdown title="Manage" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/accounts">Accounts</NavDropdown.Item>
              <NavDropdown.Item href="/accountsets">
                Accountsets
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/latestvalues">Latest Values</Nav.Link>
            <Nav.Link href="/graph">Graph</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
