import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title:"First Post", content: "This is the first post content"},
  //   {title:"Second Post", content: "This is the second post content"},
  //   {title:"Third Post", content: "This is the third post content"}
  // ];
  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;

  constructor(public postService: PostService){}
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[])=> {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string){
    this.postService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
