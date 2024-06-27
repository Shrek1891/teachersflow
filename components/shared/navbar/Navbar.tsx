'use client'
import Image from "next/image";
import Link from "next/link";
import {SignedIn, UserButton} from "@clerk/nextjs";
import Theme from "@/components/shared/Theme";
import MobileNav from "@/components/shared/MobileNav";
import GlobalSearch from "@/components/shared/search/GlobalSearch";

const Navbar = () => {
    return (
        <nav
            className="flex-between background-light850_dark200
            fixed z-50 w-full gap-5 p-5
             shadow-light-300 dark:shadow-none sm:px-12">
            <Link
                href="/"
                className="flex gap-1 items-center"
            >
                <Image
                    src={"/assets/images/logo.png"} alt="logo"
                    width={23}
                    height={23}
                />
                <p
                    className="h2-bold font-spaceGrotesk text-dark-100
                    dark:text-light-900 max-sm:hidden"

                >Ask
                    <span
                        className="text-primary-500"
                    >
                        About
                    </span>
                    All
                </p>
            </Link>
            <GlobalSearch/>
            <div className="flex-between gap-5">
                <Theme/>
                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'w-10 h-10',
                            },
                            variables: {
                                colorPrimary: '#ff7000',
                            }

                        }}
                        afterSignOutUrl="/"
                    />
                </SignedIn>
                <MobileNav/>
            </div>
        </nav>
    )
}

export default Navbar