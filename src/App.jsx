import './App.css'
import {useQueryClient, useMutation, useQuery}  from '@tanstack/react-query';

//https://jsonplaceholder.typicode.com/todos


function App() {
  const queryClient = useQueryClient();

 const {dataID}  = useQuery({
queryKey: ['posts'], 
 queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then(
        (res) => res.json()
      ),
});
//const id = dataID.id; //fetching the id 

 const {data, error, isLoading}  = useQuery({
queryKey: ['posts'], 
 queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then(
        (res) => res.json()
      ),
  //enabled : !!id,//depend on the id (bool)
  refetchOnWindowFocus: false, //stop fetching on windows focus
  retry: 5, // on error it will try n numbers times
      gcTime:6000, //garbageCollection remove old data in the cache and fetch new data
      staleTime: 6000,//action based fetching,
     refetchInterval: 4000,// cycle

});

const { mutate, isPending, isError, isSuccess} = useMutation({
  mutationFn : (newPost) => fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body : JSON.stringify(newPost),
     headers: {"Content-type":"application/json; charset=utf-8"}
  })
  .then(res => res.json()),
  onSuccess: (newPost)=>{
    queryClient.invalidateQueries({queryKey:['post']});//onSuccess fetch the new data from server
    queryClient.setQueriesData(['posts'], (oldPost)=>[...oldPost, newPost] )//onSuccess fetch the modified old data in local cache and add new data ;
  }
});

if(error) return <div> There was an error!</div>;
if(isLoading) return <div> Loading...</div>;
if(isPending) return <div> Pending...</div>;
if(isError) return <div> Error...</div>;

return (
    <>

     <h1>Hello World</h1>
     <button onClick={()=>mutate({
      userId: 1000,
      id: 4000,
      title: "Hello World",
      body: "Hello World"
     })}>
      Add New Post
     </button>
     { isSuccess && alert("Added")}
     
   { data  &&  data.map((post) => (
        <div className="card" key={post.id}>
          <h4> Title : {post.title}</h4>
          <hr />
          <h5> post :{post.title}</h5>
          </div>
      ))}
     
    </>
  )
}

export default App


