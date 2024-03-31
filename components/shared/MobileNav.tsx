'use client'
import {Sheet, SheetClose, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link";
import {SignedOut} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {sidebarLinks} from "@/constants";
import {usePathname} from "next/navigation";


const NavContent = () => {
    const pathname = usePathname()
    return (
        <section className="flex h-full flex-col gap-5 pt-16">
            {sidebarLinks.map((item) => {
                const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route
                return (
                    <SheetClose asChild key={item.route}>
                        <Link
                            className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start 
                                gap-4 bg-transparent p-4`}
                            href={item.route}
                        >
                            <Image
                                src={item.imgURL} alt={item.label} width={20} height={20}
                                className={`${isActive} ? "" : "innvert-colors"}`}
                            />
                            <p
                                className={`${isActive} ? "base-bold" : "base-medium"}`}
                            >{item.label}</p>
                        </Link>

                    </SheetClose>
                )

            })}
        </section>
    )

}
const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    alt="menu"
                    src="/assets/icons/hamburger.png"
                    width={36}
                    height={36}
                    className="invert-colors cursor-pointer sm:hidden"
                />

            </SheetTrigger>

            <SheetContent
                side="left"
                className="background-light900_dark200 border-none"
            >
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src={"/assets/images/logo.png"} alt="logo"
                        width={23}
                        height={23}
                    />
                    <p
                        className="h2-bold  text-dark-100_light900
                        font-spaceGrotesk
                    "

                    >Dev
                        <span
                            className="text-primary-500"
                        >
                        Flow
                    </span></p>
                </Link>
                <div>
                    <SheetClose asChild>
                        <NavContent/>
                    </SheetClose>
                    <SignedOut>
                        <div className="flex flex-col gap-5">
                            <SheetClose asChild>
                                <Link href="/sign-in">
                                    <Button
                                        className="w-full small-medium btn-secondary
                                        min-h-[41px] rounded-lg px-4 py-3 shadow-none"
                                    >
                                        <span className="primary-text-gradient">
                                          Log In
                                        </span>

                                    </Button>
                                </Link>

                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/sign-up">
                                    <Button
                                        className="w-full small-medium btn-tertiary light-border-2
                                        min-h-[41px] rounded-lg px-4 py-3 shadow-none text-dark400_light900"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>

                            </SheetClose>
                        </div>
                    </SignedOut>
                </div>
            </SheetContent>
        </Sheet>
    )
}
export default MobileNav

