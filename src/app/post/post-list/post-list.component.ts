import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postSub: Subscription;

  constructor(public postService: PostService){}
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts : Post[], postCount: number})=> {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }
  onChangePage(pageData: PageEvent){

    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(pageData);
    // console.log(this.postsPerPage);
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() =>  {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
