import React from "react"
import { Navbar } from "./Navbar"

export const HomePage=()=>{
    return<>
    <Navbar/>
            <header className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="display-5 fw-bold">Discover Your Next Favorite Book</h1>
                            <p className="lead">Curated collections, bestsellers, and indie gems — all in one place.</p>
                            <a href="#catalog" className="btn btn-light btn-lg">Browse Catalog</a>
                        </div>
                        <div className="col-md-6 text-center mt-4 mt-md-0">
                            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80" alt="books" className="img-fluid rounded shadow" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-5">
                <div className="container">
                    {/* <section id="catalog" className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h4">Featured Books</h2>
                            <a href="#" className="text-decoration-none">View all</a>
                        </div>

                        <div className="row g-4">
                            <div className="col-6 col-md-3">
                                <div className="card h-100">
                                    <img src="https://picsum.photos/200/300?random=1" className="card-img-top" alt="book 1" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">The Silent Reader</h5>
                                        <p className="text-muted mb-2">by A. Author</p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <strong>$12.99</strong>
                                            <button className="btn btn-sm btn-primary">Buy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="card h-100">
                                    <img src="https://picsum.photos/200/300?random=2" className="card-img-top" alt="book 2" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">Waves of Time</h5>
                                        <p className="text-muted mb-2">by B. Writer</p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <strong>$9.99</strong>
                                            <button className="btn btn-sm btn-primary">Buy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="card h-100">
                                    <img src="https://picsum.photos/200/300?random=3" className="card-img-top" alt="book 3" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">Quiet Streets</h5>
                                        <p className="text-muted mb-2">by C. Storyteller</p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <strong>$14.50</strong>
                                            <button className="btn btn-sm btn-primary">Buy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="card h-100">
                                    <img src="https://picsum.photos/200/300?random=4" className="card-img-top" alt="book 4" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">Map of Dreams</h5>
                                        <p className="text-muted mb-2">by D. Novelist</p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <strong>$11.00</strong>
                                            <button className="btn btn-sm btn-primary">Buy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> */}

                    <section id="about" className="mb-5">
                        <div className="row text-center g-4">
                            <div className="col-md-4">
                                <div className="p-4 border rounded">
                                    <h5>Curated Picks</h5>
                                    <p className="small text-muted mb-0">Hand-selected titles by our editorial team.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-4 border rounded">
                                    <h5>Fast Shipping</h5>
                                    <p className="small text-muted mb-0">Get your books delivered quickly and safely.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-4 border rounded">
                                    <h5>Secure Payments</h5>
                                    <p className="small text-muted mb-0">Multiple payment options with secure checkout.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="contact">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">Stay in touch</h5>
                                        <p className="text-muted">Subscribe for updates and new arrivals.</p>
                                        <form className="row g-2">
                                            <div className="col-sm-9">
                                                <input type="email" className="form-control" placeholder="Your email" aria-label="Email" />
                                            </div>
                                            <div className="col-sm-3 d-grid">
                                                <button className="btn btn-primary" type="submit">Subscribe</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="bg-dark text-white py-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <small>© {new Date().getFullYear()} Bookify</small>
                    <div>
                        <a href="#" className="text-white text-decoration-none me-3">Privacy</a>
                        <a href="#" className="text-white text-decoration-none">Terms</a>
                    </div>
                </div>
            </footer>
       </>
}