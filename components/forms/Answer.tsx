'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {AnswerSchema} from "@/lib/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {Editor} from "@tinymce/tinymce-react";
import React, {useRef, useState} from "react";
import {useTheme} from "@/context/ThemeProvider";
import {Button} from "@/components/ui/button";
import {createAnswer} from "@/lib/actions/answer.action";
import {usePathname} from "next/navigation";

interface Props {
    question: string
    questionId: string
    authorId: string
}

const Answer = ({question, questionId, authorId}: Props) => {
    const pathname = usePathname();
    const [isSubmiting, setIsSubmitting] = useState(false)
    const [aiSubmitting, setAiSubmitting] = useState(false)
    const editorRef = useRef(null);
    const {mode} = useTheme()
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: "",
        }
    })
    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setIsSubmitting(true)
        try {
            await createAnswer({
                content: values.answer,
                author: JSON.parse(authorId),
                question: JSON.parse(questionId),
                path: pathname

            })

            form.reset()
            if (editorRef.current) {
                const editor = editorRef.current as any
                editor.setContent('')
            }

        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setIsSubmitting(false)
        }

    }
    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark-400_light800 ">
                    Write your answer here
                </h4>

            </div>
            <Form {...form}>
                <form
                    className="mt-6 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleCreateAnswer)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({field}) => (
                            <FormItem
                                className="flex w-full flex-col gap-3"
                            >
                                <FormControl
                                    className="mt-3.5"
                                >
                                    <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}

                                        onInit={(evt, editor: any) => editorRef.current = editor}
                                        initialValue=""
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
                    <div
                        className="flex justify-end"
                    >
                        <Button
                            type="submit"
                            className="primary-gradient w-fit text-white"
                            disabled={isSubmiting}
                        >
                            {isSubmiting ? "Submiting..." : "Submit"}
                        </Button>
                    </div>
                </form>

            </Form>
        </div>
    )
}

export default Answer