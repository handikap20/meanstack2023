import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "../post/post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import {  Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map(postData => {
      return {
        posts: postData.posts.map(post  => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postUpdated.next({
        posts : [...this.posts],
        postCount: transformedPostData.maxPosts
      });
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
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    return this.http.delete("http://localhost:3000/api/posts/" +postId);
  }
}
