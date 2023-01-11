import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "../post/post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import {  Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router){

  }
  getPosts(){
    this.http.get<{message: String, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      });
    }))
    .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id : string, title: string, content: string, imagePath: string }>(
      'http://localhost:3000/api/posts/'+ id);

  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image,title);

    // const post: Post = {id: null, title: title, content:content};

    this.http.post<{message: string, post: Post }>('http://localhost:3000/api/posts',postData)
    .subscribe(responseData =>{
      const post: Post = {
            id: responseData.post.id,
            title:title,
            content:content,
            imagePath: responseData.post.imagePath,
          };
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if(typeof(image) === "object"){
      postData = new FormData();
      postData.append('id',id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image',image, title);
    }else {
      postData  = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    // const post: Post = { id:id, title: title, content: content, imagePath: null};
    this.http.put('http://localhost:3000/api/posts/'+id,postData)
    .subscribe(response => {
      const updatePost = [...this.posts];
      const oldPostIndex = updatePost.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      }
      updatePost[oldPostIndex] = post;
      this.posts = updatePost;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/" +postId)
    .subscribe(() => {
      const updatePosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatePosts;
      this.postUpdated.next([...this.posts]);
    })
  }
}
