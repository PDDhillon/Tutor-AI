import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BotMessageSquare, Home, FileSearch, Microscope } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Accordion, AccordionTrigger } from "@radix-ui/react-accordion"
import { AccordionContent, AccordionItem } from "./ui/accordion"

const sidebar_items = [
    {
        title: "Home",
        url: "/",
        icon: Home
    },
    {
        title: "Chat",
        url: "/chat",
        icon: BotMessageSquare,
    },
    {
        title: "Document Search",
        url: "/docs",
        icon: FileSearch,
    }
]

export function AppSidebar() {
    return (
        <Sidebar variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center space-x-2 p-2">
                    <Microscope className="h-8 w-8"></Microscope>
                    <span className="text-lg font-semibold">Tutor AI</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="m-auto w-full">
                    <Accordion type="multiple"  defaultValue={["item-1"]}className="p-2 space-y-2 ">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>What is Tutor AI?</AccordionTrigger>
                            <AccordionContent>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi condimentum nisi sed malesuada malesuada. Etiam vel ornare nulla. Curabitur eget ante sit amet nulla pulvinar bibendum. Proin et vulputate libero. Cras tortor sem, ullamcorper a diam volutpat, molestie hendrerit justo. Nam semper luctus sapien, eget imperdiet mi sagittis dapibus. Nullam vel ipsum eu lectus efficitur bibendum. Praesent hendrerit dolor in nisi gravida porta.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How do I use it?</AccordionTrigger>
                            <AccordionContent>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi condimentum nisi sed malesuada malesuada. Etiam vel ornare nulla. Curabitur eget ante sit amet nulla pulvinar bibendum. Proin et vulputate libero. Cras tortor sem, ullamcorper a diam volutpat, molestie hendrerit justo. Nam semper luctus sapien, eget imperdiet mi sagittis dapibus. Nullam vel ipsum eu lectus efficitur bibendum. Praesent hendrerit dolor in nisi gravida porta.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>What technologies are used?</AccordionTrigger>
                            <AccordionContent>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi condimentum nisi sed malesuada malesuada. Etiam vel ornare nulla. Curabitur eget ante sit amet nulla pulvinar bibendum. Proin et vulputate libero. Cras tortor sem, ullamcorper a diam volutpat, molestie hendrerit justo. Nam semper luctus sapien, eget imperdiet mi sagittis dapibus. Nullam vel ipsum eu lectus efficitur bibendum. Praesent hendrerit dolor in nisi gravida porta.</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <a href="https://github.com/PDDhillon">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/48107989?v=4"></AvatarImage>
                            <AvatarFallback>PD</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Pavundeep Dhillon</span>
                            <span className="truncate text-xs">github: PDDhillon</span>
                        </div>
                    </div>
                </a>
            </SidebarFooter>
        </Sidebar>
    )
}