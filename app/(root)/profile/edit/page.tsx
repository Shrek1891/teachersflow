import {auth} from "@clerk/nextjs";
import {getUserById} from "@/lib/actions/user.action";
import Question from "@/components/forms/Question";
import Profile from "@/components/forms/Profile";

const Page =async () => {
    const {userId} = auth()
    if (!userId) {
        return null
    }
    const mongoUser = await getUserById({userId})
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
            <div className="mt-9">
                <Profile
                    clerkId={userId}
                    user={JSON.stringify(mongoUser)}

                />
            </div>
        </>

    )
}

export default Page