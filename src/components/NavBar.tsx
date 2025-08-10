interface NavBarProps {
    logoName: string;
    imgSrPath: string;
}

function NavBar({ logoName, imgSrPath }: NavBarProps) {
    return (
        <nav className="navbar custom-navbar navbar-expand-md">
            <div className='container-fluid'>
                <a className="navbar-brand" href="#">
                    <img
                        src={imgSrPath}
                        width="32"
                        height="32"
                        className="brand-logo"
                        alt=""
                    />
                    <span className="fs-4">{logoName}</span>
                    <a href="#" className="nav-link-about d-none d-md-inline-block">عن التطبيق</a>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <div className="mobile-menu d-md-none">
                        <a href="#" className="nav-link-about">عن التطبيق</a>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default NavBar