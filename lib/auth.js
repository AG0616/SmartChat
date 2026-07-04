import GoogleProvider from "next-auth/providers/google"
import supabase from "./db"

export const authOptions={
    providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks:{
    async signIn({user}){
        await supabase.from('users').upsert(
            {email: user.email, name: user.name, image: user.image},
            {onConflict:'email'}
        )
        return true
    },
    async session({session}){
        const {data}= await supabase.from('users').select('id').eq('email',session.user.email).single()
        session.user.id=data?.id
        return session
    },
  },
}