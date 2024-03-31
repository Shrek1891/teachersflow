import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

interface Props {
    filters: {
        name: string,
        value: string
    }[];
    otherClasses?: string,
    containerClass?: string
}

const Filter = ({filters, otherClasses, containerClass}: Props) => {
    return (
        <div
            className={`relative ${containerClass}`}
        >
            <Select>
                <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 
                text-dark500_light700 border px-5 py-2.5`}>
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter"/>
                    </div>

                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {filters.map((filter) => (
                            <SelectItem
                                key={filter.name}
                                value={filter.value}
                            >
                                {filter.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

        </div>
    )
}

export default Filter