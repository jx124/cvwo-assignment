import React from 'react'
import { CommentProp } from './commentSlice'

function Comment({ data }: CommentProp) {
    const comment = data;
    const commentTime = new Date(data.created_at ? data.created_at : 0).getTime();
    const currentTime = new Date().getTime();
    const offset = currentTime - commentTime;

    function humanReadableDuration(milliseconds: number) {
        function numberEnding(number: number) {
            return (number > 1) ? 's' : '';
        }
        const seconds = Math.floor(milliseconds / 1000);

        const years = Math.floor(seconds / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        const months = Math.floor(seconds / 2592000);
        if (years) {
            return months + ' month' + numberEnding(months);
        }
        const days = Math.floor(seconds / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        const hours = Math.floor(seconds / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        return seconds + ' second' + numberEnding(seconds);
    }


    return (
        <div className="card text-start px-3 py-2 m-4" key={comment.id}>
            <div className='row mt-1'>
                <div className='col-auto pe-1'>
                    <p className='fw-bold'>{comment.user_id}</p>
                </div>
                <div className='col-auto ps-1'>
                    <p className='text-secondary'>{" · " + humanReadableDuration(offset) + " ago"}</p>
                </div>
            </div>
            <div className='mb-1'>
                {comment.body}
            </div>
            <div className='row'>
                <div className='col-auto pt-1'>
                    <h5>
                        ᐃ {comment.rating} ᐁ
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Comment