'use client'
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {QuestionSchema} from "@/lib/validations";
import React, {useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {createQuestion, editQuestion} from "@/lib/actions/question.action";
import {usePathname, useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeProvider";


interface Props {
    mongoUserId: string
    type?: string
    qustionDetails?: string
}

const Question = ({mongoUserId, type, qustionDetails}: Props) => {
    console.log(mongoUserId)
    const [isSubmiting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const pathname = usePathname();
    const {mode} = useTheme()
    const parsedQuestionDetails =qustionDetails && JSON.parse(qustionDetails || "{}")
    const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name)
    const form = useForm<z.infer<typeof QuestionSchema>>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            title: parsedQuestionDetails?.title || "",
            explanation: parsedQuestionDetails?.content || "",
            tags: groupedTags || [],
        },
    })
    const editorRef = useRef(null);


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof QuestionSchema>) {
        setIsSubmitting(true)
        try {
            if (type === "edit") {

                await editQuestion({
                    questionId: parsedQuestionDetails?._id,
                    title: values.title,
                    content: values.explanation,
                    tags: values.tags,
                    path: pathname
                })
                router.push(`/question/${parsedQuestionDetails?._id}`)

            } else {
                await createQuestion({
                    title: values.title,
                    content: values.explanation,
                    tags: values.tags,
                    author: JSON.parse(mongoUserId),
                    path: pathname
                });
                router.push("/")
            }


        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
        if (e.key === 'Enter' && field.name === 'tags') {
            e.preventDefault()
            const tagInput = e.target as HTMLInputElement
            const tagValue = tagInput.value.trim()
            if (tagValue !== "") {
                if (tagValue.length > 15) {
                    return form.setError('tags', {
                        message: "Tags must be less than 15 characters.",
                    })
                }
            }
            if (!field.value.includes(tagValue as never)) {
                form.setValue('tags', [...field.value, tagValue])
                tagInput.value = ""
                form.clearErrors('tags');
            }
        } else {
            form.trigger()
        }
    }

    const handleTagRemove = (tag: string, field: any) => {
        const newTags = field.value.filter((t: string) => t !== tag)
        form.setValue('tags', newTags)

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem
                            className="flex w-full flex-col"
                        >
                            <FormLabel
                                className="paragraph-semibold text-dark400_light dark:text-light800"
                            >Question Title
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl
                                className="mt-3.5"
                            >
                                <Input
                                    className="no-focus paragraph-regular
                                    background-light900_dark300 light-border-2
                                    text-dark300_light700 min-h-[56px] border
                                    "
                                    placeholder="" {...field} />
                            </FormControl>
                            <FormDescription
                                className="body-regular mt-2.5 text-light-500"
                            >
                                Imagine you are asking a question to another person.
                            </FormDescription>
                            <FormMessage
                                className="text-red-500"
                            />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="explanation"
                    render={({field}) => (
                        <FormItem
                            className="flex w-full flex-col gap-3"
                        >
                            <FormLabel
                                className="paragraph-semibold text-dark400_light dark:text-light800"
                            >Detailed explanation problem
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl
                                className="mt-3.5"
                            >
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}

                                    onInit={(evt, editor: any) => editorRef.current = editor}
                                    initialValue={parsedQuestionDetails?.content || ""}
                                    onBlur={field.onBlur}
                                    onEditorChange={(content, editor) => field.onChange(content)}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                                        ],
                                        toolbar: 'undo redo |  ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        skin: mode === 'light' ? 'oxide' : 'oxide-dark',
                                        content_css: mode === 'dark' ? 'dark' : 'light'
                                    }}
                                />

                            </FormControl>
                            <FormDescription
                                className="body-regular mt-2.5 text-light-500"
                            >
                                Introduce the problem in detail
                            </FormDescription>
                            <FormMessage
                                className="text-red-500"
                            />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({field}) => (
                        <FormItem
                            className="flex w-full flex-col"
                        >
                            <FormLabel
                                className="paragraph-semibold text-dark400_light dark:text-light800"
                            >Question Title
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl
                                className="mt-3.5"
                            >
                                <>
                                    <Input
                                        className="no-focus paragraph-regular
                                    background-light900_dark300 light-border-2
                                    text-dark300_light700 min-h-[56px] border
                                    "
                                        disabled={type === "edit"}
                                        placeholder="Add tags..."
                                        onKeyDown={(e) => {
                                            handleInputKeydown(e, field)
                                        }}
                                    />
                                    {field.value.length > 0 && (
                                        <div
                                            className="flex-start mt-2.5 gap-2.5"
                                        >
                                            {field.value.map((tag: any) => (
                                                <Badge
                                                    key={tag}
                                                    className="subbtle-medium background-light800_dark300 text-light400_500 flex items-center
                                                    justify-center gap-2 rounded-md border-none px-4 py-2 capitalize
                                                    "
                                                    onClick={() => {
                                                        type !== "edit" ? handleTagRemove(tag, field) : ()=>{}
                                                    }}
                                                >
                                                    {tag}
                                                    {type !== "edit" && <Image
                                                        src="/assets/icons/close.png"
                                                        alt="close icon"
                                                        width={12}
                                                        height={12}
                                                        className="cursor-pointer object-contain invert-0  dark:invert"
                                                    />}
                                                </Badge>
                                            ))

                                            }
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription
                                className="body-regular mt-2.5 text-light-500"
                            >
                                Add up to 3 tags to describe what your question is about.
                            </FormDescription>
                            <FormMessage
                                className="text-red-500"
                            />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="primary-gradient w-fit !text-light-900" disabled={isSubmiting}
                >{isSubmiting ?
                    (
                        <>
                            {type === 'edit' ? 'Editing...' : 'Posting...'}
                        </>
                    ) : (
                        <>
                            {type === 'edit' ? 'Edit Question' : 'Ask a Question'}
                        </>
                    )
                }</Button>
            </form>
        </Form>
    )
}

export default Question