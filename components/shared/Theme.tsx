'use client'
import {useTheme} from "@/context/ThemeProvider";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger,} from "@/components/ui/menubar"
import Image from "next/image";
import {themes} from "@/constants";

const Theme = () => {
    const {mode, setMode} = useTheme()
    return (
        <Menubar
            className="relative border-none bg-transparent shadow-none"
        >
            <MenubarMenu>
                <MenubarTrigger
                    className="focus::bg-light-900 data-[state=open]:bg-light-900
                    dark:focus::bg-dark-200 dark:data-[state=open]:bg-dark-200"
                >{
                    mode === 'light' ? (
                        <Image
                            src="/assets/images/sun.svg" alt="light" width={23} height={23}
                            className="active-theme"
                        />
                    ) : (
                        <Image
                            src="/assets/images/moon.png" alt="dark" width={23} height={23}
                            className="active-theme"
                        />
                    )
                }</MenubarTrigger>
                <MenubarContent
                    className="absolute right-[-3rem] mt-3 min-w-[120px] rounded
                    border py-2 dark:border-dark-400 dark:bg-dark-300
                    "
                >
                    {themes.map((option) => (
                        <MenubarItem
                            key={option.value}
                            onClick={() => {
                                setMode(option.value)
                                if (option.value !== 'system') {
                                    localStorage.theme = option.value
                                } else {
                                    localStorage.removeItem('theme')
                                }
                            }}
                            className="flex items-center
                                gap-4 px-2.5 py-1.5
                                dark:focus:bg-dark-400
                                "
                        >
                            <Image
                                src={option.icon} alt={option.label} width={23} height={23}
                                className={`${mode === option.value ? 'active-theme' : ''}`}
                            />
                            <p
                                className={`body-semibold text-light-500 ${mode === option.value ? 'active-theme' : ''}`}

                            >{option.label}</p>
                        </MenubarItem>))
                    }

                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default Theme