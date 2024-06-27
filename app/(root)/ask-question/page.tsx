'use server'
import Question from "@/components/forms/Question";
import {redirect} from "next/navigation";
import {getUserById} from "@/lib/actions/user.action";
import {auth} from "@clerk/nextjs";


const page = async () => {
    const {userId} = await auth();
    //const userId=process.env.CLERK_ID
    if (!userId) redirect('/sign-in')
    const mongoUser = await getUserById({ userId });
    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
            <div className="mt-9">
                <Question mongoUserId={JSON.stringify(mongoUser)}/>
            </div>

        </div>
    );
}

export default page